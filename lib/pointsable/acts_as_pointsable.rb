module Pointsable
  module ActsAsPointsable
    extend ActiveSupport::Concern

    module ClassMethods
      def acts_as_pointsable(args={})
        has_many :points, class_name: "Pointsable::Points", as: :pointsable

        attr_accessible :points_attributes
        accepts_nested_attributes_for :points, allow_destroy: true

        args.reverse_merge({:url_method => :url })
        class_eval %Q(
          def pointsable_url
            #{args[:url_method].to_s}
          end
          )
      end
    end
  end
end

