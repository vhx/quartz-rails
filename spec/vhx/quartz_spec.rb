require 'spec_helper'

describe Vhx::Quartz do
  it 'has a version number' do
    expect(Vhx::Quartz::VERSION).not_to be nil
  end

  it 'contains the vhx-quartz.css file in the vendor/assets folder' do
    file = "#{Rails.root}/vendor/assets/stylesheets/vhx-quartz.css"
    File.exists?(file).should be_true
  end
end
