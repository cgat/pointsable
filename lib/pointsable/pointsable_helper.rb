module Pointsable
  module PointsableHelper
    def pointsable_show(object, viewing_width)
      render partial: 'pointsable/points/points_on_image',
                locals: {options: {container: "poinstable_container_#{object.class.name}_#{object.id}", viewingWidth: viewing_width, imageUrl: object.pointsable_url, points: object.points, draggable: false}}
    end

    def pointsable_form(object, viewing_width, form_builder, controls_options={} )
      controls_options.reverse_merge!({add_points: true, remove_points: true})
      render partial: 'pointsable/points/points_on_image_nested_form',
                locals: {f: form_builder, controls: controls_options, options: {container: "poinstable_container_#{object.class.name}_#{object.id}", viewingWidth: viewing_width, imageUrl: object.pointsable_url, points: object.points, draggable: true}}
    end

    def point_fields_template(form_builder)
      new_point = form_builder.object.points.new
      new_point.label = "TMP_LABEL"
      id = new_point.object_id
      fields = form_builder.fields_for(:points, new_point, child_index: id) do |builder|
        render("pointsable/points/point_fields", builder: builder)
      end
      content_tag(:div, nil, data: {id: id, fields: fields.gsub("\n","")}, id: "point_fields_template").html_safe
    end
  end
end
