# == Schema Information
#
# Table name: notes
#
#  id           :uuid             not null, primary key
#  content      :text             not null
#  notable_type :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  notable_id   :uuid
#
# Indexes
#
#  index_notes_on_notable_type_and_notable_id  (notable_type,notable_id)
#
class Note < ApplicationRecord
  belongs_to :notable, polymorphic: true
end
