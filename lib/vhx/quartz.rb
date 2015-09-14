require "vhx/quartz/version"

if !defined?(Rails)
  require 'Rails'
end

module Vhx
  module Quartz
    module Rails
      class Engine < ::Rails::Engine
      end
    end
  end
end
