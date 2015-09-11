require 'spec_helper'

describe Vhx::Quartz do
  it 'has a version number' do
    expect(Vhx::Quartz::VERSION).not_to be nil
  end

  it 'contains the vhx-quartz.css file in the vendor/assets/stylesheets folder' do
    File.file?("vendor/assets/stylesheets/vhx-quartz.css").should be true
  end

  it 'contains a minified version of the vhx-quartz.css file in vendor/assets/stylesheets folder' do
    File.file?("vendor/assets/stylesheets/vhx-quartz.min.css").should be true
  end
end
