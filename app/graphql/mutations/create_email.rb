module Types
  class CreateEmailInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :email_address, String, required: true
    argument :email_type, String, required: false
  end
end

module Mutations
  class CreateEmail < BaseMutation
    argument :input, Types::CreateEmailInputType, required: true

    field :email, Types::EmailType, null: true

    def resolve(input:)
      email = Email.new(
        person_id: input.person_id,
        email_address: input.email_address,
        email_type: input.email_type
      )
      if email.save
        return { email: email }
      else
        return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
      end
    end
  end
end



