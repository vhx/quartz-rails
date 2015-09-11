# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'vhx/quartz/version'

Gem::Specification.new do |spec|
  spec.name          = "vhx-quartz"
  spec.version       = Vhx::Quartz::VERSION
  spec.authors       = ["Scott Robertson, Courtney Burton, Steven Bone, David Gonzalez"]
  spec.email         = ["scott@vhx.tv, courtney@vhx.tv, sbone@vhx.tv, david@vhx.tv"]

  spec.summary       = %q{VHX Styleguide - Quartz}
  spec.description   = %q{Official VHX Styleguide}
  spec.homepage      = "http://github.com/vhx/quartz-rails"
  spec.license       = "MIT"

  # Prevent pushing this gem to RubyGems.org by setting 'allowed_push_host', or
  # delete this section to allow pushing this gem to any host.
  # if spec.respond_to?(:metadata)
  #   spec.metadata['allowed_push_host'] = "TODO: Set to 'http://mygemserver.com'"
  # else
  #   raise "RubyGems 2.0 or newer is required to protect against public gem pushes."
  # end

  spec.files         = Dir["{lib,vendor}/**/*"] + ["CODE_OF_CONDUCT.md", "README.md"]
  spec.require_paths = ["lib"]

  spec.add_development_dependency "railties", "~> 3.1"
  spec.add_development_dependency "bundler", "~> 1.10"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec"
end