# == Schema Information
#
# Table name: emails
#
#  id            :uuid             not null, primary key
#  email_address :string           not null
#  email_type    :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  person_id     :uuid
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
  validates :email_address, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email_type, inclusion: { in: %w[personal work school], allow_nil: true }

  belongs_to :person
end
