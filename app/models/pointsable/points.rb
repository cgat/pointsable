module Pointsable
  class Points < ActiveRecord::Base
    belongs_to :pointsable, polymorphic: true
    attr_accessible :label, :pointsable_id, :pointsable_type, :x, :y
  end
end
