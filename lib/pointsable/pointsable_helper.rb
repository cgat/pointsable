module Pointsable
  module PointsableHelper
    def pointsable_show(object, options)
      options.reverse_merge!({container: "poinstable_container_#{object.class.name}_#{object.id}",
                                          image_url: object.pointsable_url,
                                          points: object.points,
                                          draggable: false,
                                          points_scale_factor: 1})
      render partial: 'pointsable/points/points_on_image',
                locals: {options: options}
    end

    def pointsable_form(object, form_builder, options={} )
      options.reverse_merge!({container: "poinstable_container_#{object.class.name}_#{object.id}",
                                          image_url: object.pointsable_url,
                                          points: object.points,
                                          draggable: true,
                                          add_points_widget: true,
                                          remove_points_widget: true,
                                          points_scale_factor: 1})
      raise ArgumentError, "The viewing_width parameter is required" unless options.has_key?(:viewing_width)
      render partial: 'pointsable/points/points_on_image_nested_form',
                locals: {f: form_builder, options: options}
    end

    def point_fields_template(form_builder, container_name)
      raise ArgumentError, "A container_name must be given" if container_name.blank?
      new_point = form_builder.object.points.new
      new_point.label = "TMP_LABEL"
      id = new_point.object_id
      fields = form_builder.fields_for(:points, new_point, child_index: id) do |builder|
        render("pointsable/points/point_fields", builder: builder)
      end
      content_tag(:div, nil, data: {id: id, fields: fields.gsub("\n","")}, id: "#{container_name}_fields_template").html_safe
    end
  end
end
