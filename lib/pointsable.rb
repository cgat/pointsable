
module Pointsable
  require "pointsable/engine"
  require "pointsable/acts_as_pointsable"
  require "pointsable/pointsable_helper"
   class Railtie < Rails::Railtie
     initializer "include acts_as_pointsable within ActiveRecord" do
       ActiveSupport.on_load(:active_record) do
         ActiveRecord::Base.send(:include, Pointsable::ActsAsPointsable)
       end
     end
  end
end
