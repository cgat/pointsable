class Image < ActiveRecord::Base
  attr_accessible :image
  acts_as_pointsable url_method: :image
end
