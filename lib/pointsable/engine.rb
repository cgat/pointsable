module Pointsable
  class Engine < ::Rails::Engine
    isolate_namespace Pointsable
    config.generators do |g|
      g.test_framework      :rspec,        :fixture => false
      g.fixture_replacement :factory_girl, :dir => 'spec/factories'
      g.assets false
      g.helper false
    end
    initializer "pointsable view helpers" do |app|
     ActionView::Base.send :include, PointsableHelper
   end
  end

end
