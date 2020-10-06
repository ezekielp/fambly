module Mutations
  class CreateDummyUser < BaseMutation

    field :dummy_email, Types::DummyEmailType, null: true

    def resolve
      email = SecureRandom.uuid + "@fakeemail.com"
      user = User.new(email: email, password: "dummy_user_password")

      if user.save
        login_user(user)
        dummy_email = DummyEmail.create(email: email, user_id: user.id)
        return { dummy_email: dummy_email }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end