module Types
  class DeleteEmailInputType < Types::BaseInputObject
    argument :email_id, ID, required: true
  end
end

module Mutations
  class DeleteEmail < BaseMutation
    argument :input, Types::DeleteEmailInputType, required: true

    type Boolean

    def resolve(input:)
      email = Email.find_by(id: input.email_id)

      if email
        email.destroy
        return true
      end
      false
    end
  end
end