module Types
  class CreateEmailInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :email, String, required: true
    argument :email_type, String, required: false
  end
end

module Mutations
  class CreateEmail < BaseMutation
    argument :input, Types::CreateEmailInputType, required: true

    field :email, Types::EmailType, null: true


  end
end



