module Types
    class CreateUserInputType < Types::BaseInputObject
        argument :email, String, required: true
        argument :password, String, required: true
    end
end

module Mutations
    class CreateUser < BaseMutation
        argument :input, Types::CreateUserInputType, required: true

        field :user, Types::UserType, null: false

        def resolve(input:)
            user = User.create!(
                email: input.email,
                password: input.password
            )

            { user: user }
        end
    end
end