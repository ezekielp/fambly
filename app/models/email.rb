# == Schema Information
#
# Table name: emails
#
#  id         :uuid             not null, primary key
#  email      :string           not null
#  email_type :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid
#
# Indexes
#
#  index_emails_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Email < ApplicationRecord
end
