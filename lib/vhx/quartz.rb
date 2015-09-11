require "vhx/quartz/version"

if !defined?(Rails)
  require 'Rails'
end

module Vhx
  module Rails
    class Engine < ::Rails::Engine
    end
  end
end
