'use strict';

vhxm.components.shared.select.controller = function (opts) {
  var self = this;
  var api = opts.api ? opts.api : m.prop(null);

  self.init = function () {
    self.state = new vhxm.components.shared.select.state();
    self.model = new vhxm.components.shared.select.model();

    self.type = opts.type || 'standard';
    self.multiselect = opts.multiselect || false;
    self.model.items = opts.items;

    if (opts.selected) {
      self.state.selected(opts.selected);
    }

    if (opts.onSelect) {
      self.state.onSelect = opts.onSelect;
    }

    if (opts.onAction) {
      self.state.onAction = opts.onAction;
    }

    $(document).on('click', function (event) {
      var is_dropdown = $(event.target).closest('.c-select--container').length;

      if (!is_dropdown && self.state.isDropdownOpen()) {
        m.startComputation();
        self.state.isDropdownOpen(false);
        m.endComputation();
      }
    });

    api(self);
  };

  self.selectedLabel = function () {
    var selected = opts.placeholder ? opts.placeholder : 'Select...';

    if (self.state.selected()) {
      self.model.items().map(function (item) {
        if (self.state.selected()[item[opts.prop_map.key]]) {
          selected = self.state.selected()[item[opts.prop_map.key]].label;
        }
      });
      if (Object.keys(self.state.selected()).length > 1) {
        selected = 'Multiple items selected';
      }
    }

    return selected;
  };

  self.handleKeydown = function (event) {
    var container = $(event.target).closest('.c-select--container');
    var options = container.find('.c-select--options');
    var input = container.find('.c-select--input-container input');

    // Down Arrow
    if (event.keyCode === 40) {
      event.preventDefault();
      self.setHighlightedState('down', options);
    }
    // Up Arrow
    else if (event.keyCode === 38) {
        event.preventDefault();
        self.setHighlightedState('up', options, input);
      }
      // Enter/Return
      else if (event.keyCode === 13 && self.state.isDropdownOpen()) {
          event.preventDefault();
          self.selectItem(self.model.items()[self.state.highlightIndex()]);
        }
  };

  self.handleClick = function (event) {
    event.preventDefault();
    var container = $(event.target).closest('.c-select--container').find('.c-select--options');

    if (!self.state.isDropdownOpen()) {
      self.state.focusInput(true);
    }

    self.state.isDropdownOpen(!self.state.isDropdownOpen());

    self.state.highlightIndex(-1);

    self.scrollOptionsList(container);
  };

  self.handleInput = function (event) {
    self.state.highlightIndex(-1);
    self.state.searchInputValue(event.target.value);
    self.state.isLoading(true);
  };

  self.selectItem = function (item) {
    var selected = void 0;
    if (!self.multiselect) {
      self.state.selected({});
    }

    selected = self.state.selected() || self.state.selected({});

    if (selected[item[opts.prop_map.key]]) {
      delete selected[item[opts.prop_map.key]];
    } else {
      selected[item[opts.prop_map.key]] = {
        value: item[opts.prop_map.value],
        label: item[opts.prop_map.label]
      };
    }

    self.state.selected(selected);
    self.state.isDropdownOpen(self.multiselect ? true : false);
    self.state.onSelect(self.state.selected());
    if (!self.multiselect) {
      self.state.highlightIndex(-1);
      self.scrollOptionsList(0);
    }
  };

  self.handleAction = function (event) {
    event.preventDefault();
    m.startComputation();
    self.state.footerLoading(true);
    m.endComputation();

    self.state.onAction(function () {
      m.startComputation();
      self.state.searchInputValue('');
      self.state.footerLoading(false);
      m.endComputation();
    });
  };

  self.searchCallback = function (data) {
    m.startComputation();
    self.model.items(data);
    self.state.isLoading(false);
    m.endComputation();
  };

  self.setHighlightedState = function (direction, container, input) {
    if (direction === 'down') {
      self.state.highlightIndex(self.state.highlightIndex() + 1);
      if (self.state.highlightIndex() < self.model.items().length) {
        self.state.scrollIndex(self.state.scrollIndex() + 1);
      } else {
        self.state.highlightIndex(self.model.items().length - 1);
      }
    } else if (direction === 'up') {
      self.state.highlightIndex(self.state.highlightIndex() - 1);
      if (self.state.highlightIndex() > 0) {
        self.state.scrollIndex(self.state.scrollIndex() - 1);
      } else if (self.state.highlightIndex() < 0) {
        self.state.highlightIndex(-1);
        input.focus();
      } else {
        self.state.highlightIndex(0);
      }
    }
    self.scrollOptionsList(container);
  };

  self.scrollOptionsList = function (container) {
    if (container.length) {
      container.eq(0).scrollTop(self.state.optionHeight() * self.state.highlightIndex());
    }
  };

  if (opts.init) {
    self.init();
  }
};

vhxm.components.shared.select.model = function () {
  this.items = m.prop(null);
};

vhxm.components.shared.select.state = function () {
  this.selected = m.prop(null);
  this.highlighted = m.prop({});
  this.isDropdownOpen = m.prop(false);
  this.highlightIndex = m.prop(null);
  this.scrollIndex = m.prop(0);
  this.optionHeight = m.prop(0);
  this.optionsHeight = m.prop(0);
  this.isLoading = m.prop(false);
  this.searchInputValue = m.prop('');
  this.footerLoading = m.prop(false);
  this.focusInput = m.prop(true);
  this.onSelect = function () {};
  this.onAction = function (done) {
    done();
  };
};

vhxm.components.shared.select.ui.container = {
  controller: function controller(opts) {
    opts.init = true;
    return new vhxm.components.shared.select.controller(opts);
  },
  view: function view(ctrl, opts) {
    var options = opts.search ? '.has-search' : '';
    options += opts.trigger ? '.has-trigger' : '';
    options += opts.inline ? '.inline' : '';

    if (opts.trigger) {
      opts.trigger.attrs.onclick = ctrl.handleClick;
      opts.trigger.attrs.className += ' c-select--trigger';
    }

    return m('.c-select--container.relative.form' + options, {
      config: function config(el, isInitialized) {
        if (opts.trigger && isInitialized) {
          var left_pos = el.querySelector('.c-select--trigger').offsetWidth * 0.25;
          el.querySelector('.c-select--caret').style.left = left_pos + 'px';
        }
      },
      onmouseleave: function onmouseleave() {
        ctrl.state.highlightIndex(-1);
      },
      onkeydown: ctrl.handleKeydown
    }, [opts.trigger ? opts.trigger : m('a.c-select--trigger.btn-dropdown-' + (opts.color ? opts.color : 'gray') + '.btn--fill' + (ctrl.state.isDropdownOpen() ? '.is-active' : ''), {
      href: '#',
      onclick: ctrl.handleClick
    }, ctrl.selectedLabel()), m('.c-select--dropdown.bg-white.border.radius.fill-width' + (ctrl.state.isDropdownOpen() ? '.is-open' : ''), [opts.search ?
    // if search is enabled
    m('.c-select--input-container.padding-medium.absolute.bg-white.fill-width.radius', [m.component(vhxm.components.shared.search_input.ui.container, {
      config: function config(el, init) {
        el.value = ctrl.state.searchInputValue();
        if (ctrl.state.focusInput()) {
          setTimeout(function () {
            el.focus();
            ctrl.state.focusInput(false);
          }, 10);
        }
      },
      callback: ctrl.searchCallback,
      search: function search(query, callback) {
        if (ctrl.state.highlightIndex() === -1) {
          opts.search(query, callback);
        }
      },
      placeholder: 'Search',
      oninput: ctrl.handleInput
    })]) : '', m.component(vhxm.components.shared.select.ui.list.container, opts, ctrl), opts.action && ctrl.state.searchInputValue().length ?
    // show Create New Category dropdown footer action
    m('.c-select--footer.border-top', [m('a.btn-teal.btn--fill' + (ctrl.state.footerLoading() ? '.is-loading' : ''), {
      onclick: ctrl.handleAction,
      href: '#'
    }, opts.action + (ctrl.state.searchInputValue().length ? ' \'' + ctrl.state.searchInputValue() + '\'' : ''))]) : '', m('span.c-select--caret')])]);
  }
};

/* ................................................
  Media Item Component
.................................................*/
vhxm.components.shared.select.ui.item_media = {
  view: function view(c, params) {
    var item = params.item;
    var index = params.index;
    var ctrl = params.ctrl;
    var opts = params.opts;

    return m('.c-media-item--container.padding-horz-medium.padding-vert-small.clearfix' + (index === ctrl.state.highlightIndex() ? '.is-selected' : ''), {
      onmouseover: function onmouseover() {
        ctrl.state.highlightIndex(index);
      },
      onclick: function onclick(event) {
        ctrl.handleItemClick(event, item);
      }
    }, [m('.c-media-item--image-container.left', [m('img.c-media-item--image.radius.margin-right-medium', {
      src: item[opts.prop_map.img],
      width: 70,
      height: 40
    })]), m('.c-media-item--content.clearfix.left', [m('p.text--navy', item[opts.prop_map.label]), m('p.text--gray', item[opts.prop_map.descriptor])]), m('.c-media-item--action.clearfix.right', [m('.c-item-toggle.icon--xsmall.icon-check-navy.border' + (ctrl.state.selected() && ctrl.state.selected()[item[opts.prop_map.key]] ? '.is-selected.icon-check-navy' : '.icon-plus-thin-white'))])]);
  }
};

/* ................................................
  Standard Item Component
.................................................*/
vhxm.components.shared.select.ui.item_standard = {
  view: function view(c, params) {
    var item = params.item;
    var index = params.index;
    var ctrl = params.ctrl;
    var opts = params.opts;

    return m('li.c-select--option.padding-horz-medium.padding-vert-xsmall' + (index === ctrl.state.highlightIndex() ? '.is-selected' : ''), {
      config: function config(el) {
        ctrl.state.optionHeight($(el).outerHeight());
      },
      onmouseover: function onmouseover() {
        ctrl.state.highlightIndex(index);
      },
      onclick: function onclick(event) {
        ctrl.handleItemClick(event, item);
      }
    }, [m('span.c-select--item-label.text--navy', item[opts.prop_map.label]), item[opts.prop_map.descriptor] ? m('span.right.text--gray', item[opts.prop_map.descriptor]) : '']);
  }
};

vhxm.components.shared.select.ui.list.controller = function (opts, parent) {
  var self = this;

  self.parent = parent;
  self.state = parent.state;
  self.model = parent.model;

  self.hasItems = function () {
    return self.model.items() && self.model.items().length > 0;
  };

  self.handleItemClick = function (event, item) {
    self.parent.selectItem(item);
  };
};

/* ................................................
  Select List Component
.................................................*/
vhxm.components.shared.select.ui.list.container = {
  controller: function controller(opts, parent) {
    return new vhxm.components.shared.select.ui.list.controller(opts, parent);
  },
  view: function view(ctrl, opts) {
    return m('ul.c-select--options.margin-left-reset.loader-slate.loader--transparent' + (ctrl.state.isLoading() ? '.is-loading' : ''), {
      config: function config(el) {
        ctrl.state.optionsHeight($(el).outerHeight());
      }
    }, [ctrl.hasItems() ? ctrl.model.items().map(function (item, index) {
      return m.component(vhxm.components.shared.select.ui['item_' + ctrl.parent.type], {
        item: item,
        index: index,
        ctrl: ctrl,
        opts: opts
      });
    }) : m.component(vhxm.components.shared.select.ui.list.empty, opts)]);
  }
};

/* List Empty
.................................................*/
vhxm.components.shared.select.ui.list.empty = {
  view: function view() {
    return m('li.c-select--option.padding-horz-large.padding-top-small.padding-bottom-medium.text.primary', 'No results');
  }
};
