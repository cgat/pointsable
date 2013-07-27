class CreatePointsablePoints < ActiveRecord::Migration
  def change
    create_table :pointsable_points do |t|
      t.integer :x
      t.integer :y
      t.string :label
      t.string :pointsable_type
      t.integer :pointsable_id

      t.timestamps
    end
  end
end
