class Image < ActiveRecord::Base
  attr_accessible :image, :points_attributes
  has_many :points, class_name: "Pointsable::Points", as: :pointsable
  accepts_nested_attributes_for :points
end
