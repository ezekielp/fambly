require 'rails_helper'

RSpec.describe User, type: :model do
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:invalid_password) { '1234567' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }
    let(:valid_user) { User.create(email: valid_email, password: valid_password) }

    describe 'ActiveModel validations' do
        it 'is valid with valid attributes' do
            expect(valid_user).to be_valid
        end

        describe 'email' do
            it 'validates its presence' do
                expect(User.create(email: nil, password: valid_password)).to_not be_valid
            end

            it 'validates its uniqueness' do
                user = User.create(email: valid_email, password: valid_password)
                expect(User.create(email: valid_email, password: valid_password)).to_not be_valid
            end

            it 'validates its format' do
                expect(User.create(email: invalid_email, password: valid_password)).to_not be_valid
            end
        end

        describe 'password' do
            it 'validates that it is eight characters or longer' do
                expect(User.create(email: valid_email, password: invalid_password)).to_not be_valid
            end
        end

        describe 'password_digest' do
            it 'validates its presence' do
                expect(User.create(email: valid_email)).to_not be_valid
            end
        end

        describe 'session_token' do
            it 'validates its uniqueness' do
                user = User.create(email: valid_email, password: valid_password, session_token: '3hd892nnf43n48r')
                expect(User.create(email: 'new_email@example.com', password: valid_password, session_token: '3hd892nnf43n48r')).to_not be_valid
            end
        end
    end

    describe 'find_by_credentials' do 
        it 'returns a user if the user exists and the password is valid' do
            user = User.create(email: valid_email, password: valid_password)
            expect(User.find_by_credentials(valid_email, valid_password)).to eq(user)
        end

        it 'returns nil if the user does not exist' do
            expect(User.find_by_credentials('not_a_user_email', valid_password)).to eq(nil)
        end

        it 'return nil if the password is not valid' do
            expect(User.find_by_credentials(valid_email, invalid_password)).to eq(nil)
        end
    end

    describe 'valid_password?' do 
        it "returns true if a hashed password matches the user's password_digest" do
            expect(valid_user.valid_password?(valid_password)).to be(true)
        end

        it "return false if a hashed password does not match the user's password" do
            expect(valid_user.valid_password?(invalid_password)).to be(false)
        end
    end

    describe 'reset_session_token' do
        it "returns the user's session_token" do
            new_session_token = valid_user.reset_session_token!

            expect(valid_user.session_token).to eq(new_session_token)
        end
    end

    describe 'ensure_session_token' do 
        it 'calls generate_session_token when a user session_token is nil' do
            expect(valid_user).to receive(:generate_session_token)

            valid_user.session_token = nil
            valid_user.ensure_session_token
        end
    end
end
