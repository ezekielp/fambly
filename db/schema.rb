# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_12_25_175607) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "amorous_relationships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "partner_one_id"
    t.uuid "partner_two_id"
    t.boolean "current", default: true
    t.string "relationship_type"
    t.integer "start_year"
    t.integer "start_month"
    t.integer "start_day"
    t.integer "end_year"
    t.integer "end_month"
    t.integer "end_day"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "wedding_year"
    t.integer "wedding_month"
    t.integer "wedding_day"
    t.index ["partner_one_id"], name: "index_amorous_relationships_on_partner_one_id"
    t.index ["partner_two_id"], name: "index_amorous_relationships_on_partner_two_id"
  end

  create_table "dummy_emails", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.uuid "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_dummy_emails_on_user_id"
  end

  create_table "emails", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id"
    t.string "email_address", null: false
    t.string "email_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["person_id"], name: "index_emails_on_person_id"
  end

  create_table "notes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "notable_type"
    t.uuid "notable_id"
    t.index ["notable_type", "notable_id"], name: "index_notes_on_notable_type_and_notable_id"
  end

  create_table "parent_children", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "parent_id"
    t.uuid "child_id"
    t.string "parent_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["child_id"], name: "index_parent_children_on_child_id"
    t.index ["parent_id"], name: "index_parent_children_on_parent_id"
  end

  create_table "people", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.integer "months_old"
    t.integer "age"
    t.integer "birth_year"
    t.integer "birth_day"
    t.date "date_age_added"
    t.integer "birth_month"
    t.boolean "show_on_dashboard", default: true
    t.string "gender"
    t.string "middle_name"
    t.index ["user_id"], name: "index_people_on_user_id"
  end

  create_table "person_places", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id"
    t.uuid "place_id"
    t.boolean "current", default: false
    t.integer "start_year"
    t.integer "start_month"
    t.integer "end_year"
    t.integer "end_month"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "place_type"
    t.index ["person_id"], name: "index_person_places_on_person_id"
    t.index ["place_id"], name: "index_person_places_on_place_id"
  end

  create_table "person_tags", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id"
    t.uuid "tag_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["person_id"], name: "index_person_tags_on_person_id"
    t.index ["tag_id"], name: "index_person_tags_on_tag_id"
  end

  create_table "places", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "country", null: false
    t.string "state_or_region"
    t.string "town"
    t.string "street"
    t.string "zip_code"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
  end

  create_table "sibling_relationships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "sibling_one_id"
    t.uuid "sibling_two_id"
    t.string "sibling_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sibling_one_id"], name: "index_sibling_relationships_on_sibling_one_id"
    t.index ["sibling_two_id"], name: "index_sibling_relationships_on_sibling_two_id"
  end

  create_table "tags", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "color"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "trip_people", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id"
    t.uuid "trip_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["person_id"], name: "index_trip_people_on_person_id"
    t.index ["trip_id"], name: "index_trip_people_on_trip_id"
  end

  create_table "trip_places", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "trip_stage_id"
    t.uuid "place_id"
    t.integer "visit_day"
    t.integer "visit_month"
    t.integer "visit_year"
    t.string "place_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["place_id"], name: "index_trip_places_on_place_id"
    t.index ["trip_stage_id"], name: "index_trip_places_on_trip_stage_id"
  end

  create_table "trip_stage_people", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id"
    t.uuid "trip_stage_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["person_id"], name: "index_trip_stage_people_on_person_id"
    t.index ["trip_stage_id"], name: "index_trip_stage_people_on_trip_stage_id"
  end

  create_table "trip_stages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "trip_id"
    t.uuid "place_id"
    t.uuid "accommodation_id"
    t.integer "start_day"
    t.integer "start_month"
    t.integer "start_year"
    t.integer "end_day"
    t.integer "end_month"
    t.integer "end_year"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["accommodation_id"], name: "index_trip_stages_on_accommodation_id"
    t.index ["place_id"], name: "index_trip_stages_on_place_id"
    t.index ["trip_id"], name: "index_trip_stages_on_trip_id"
  end

  create_table "trips", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "departure_point_id"
    t.uuid "end_point_id"
    t.integer "departure_day"
    t.integer "departure_month"
    t.integer "departure_year"
    t.integer "end_day"
    t.integer "end_month"
    t.integer "end_year"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["departure_point_id"], name: "index_trips_on_departure_point_id"
    t.index ["end_point_id"], name: "index_trips_on_end_point_id"
    t.index ["user_id"], name: "index_trips_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end

  add_foreign_key "amorous_relationships", "people", column: "partner_one_id"
  add_foreign_key "amorous_relationships", "people", column: "partner_two_id"
  add_foreign_key "dummy_emails", "users"
  add_foreign_key "emails", "people"
  add_foreign_key "parent_children", "people", column: "child_id"
  add_foreign_key "parent_children", "people", column: "parent_id"
  add_foreign_key "people", "users"
  add_foreign_key "person_places", "people"
  add_foreign_key "person_places", "places"
  add_foreign_key "person_tags", "people"
  add_foreign_key "person_tags", "tags"
  add_foreign_key "sibling_relationships", "people", column: "sibling_one_id"
  add_foreign_key "sibling_relationships", "people", column: "sibling_two_id"
  add_foreign_key "tags", "users"
  add_foreign_key "trip_people", "people"
  add_foreign_key "trip_people", "trips"
  add_foreign_key "trip_places", "places"
  add_foreign_key "trip_places", "trip_stages"
  add_foreign_key "trip_stage_people", "people"
  add_foreign_key "trip_stage_people", "trip_stages"
  add_foreign_key "trip_stages", "places"
  add_foreign_key "trip_stages", "places", column: "accommodation_id"
  add_foreign_key "trip_stages", "trips"
  add_foreign_key "trips", "places", column: "departure_point_id"
  add_foreign_key "trips", "places", column: "end_point_id"
  add_foreign_key "trips", "users"
end
