module Types
  class UpdateEmailInputType < Types::BaseInputObject
    argument :email_id, ID, required: true
    argument :email_address, String, required: false
    argument :email_type, String, required: false
  end
end

module Mutations
  class UpdateEmail < BaseMutation
    argument :input, Types::UpdateEmailInputType, required: true

    field :email, Types::EmailType, null: true

    def resolve(input:)
      email = Email.find_by(id: input.email_id)

      if email
        email.update(email_address: input.email_address, email_type: input.email_type)
        return { email: email }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
