require 'rails_helper'

RSpec.describe User do
    let(:params) { { email: 'new_user@example.com', password: 'ih349h32e8ASDH@E!!@$H' } }

    describe 'ActiveModel validations' do
        describe 'email' do
            it 'validates its presence' do
            end

            it 'validates its uniqueness' do
            end

        end

        describe 'password' do
            it 'validates that it is eight characters or longer' do
            end

            it 'allows password to be nil' do
            end

        end

        describe 'password_digest' do
            it 'validates its presence' do
            end

        end

        describe 'session_token' do
            it 'validates its presence' do
            end

            it 'validates its uniqueness' do
            end

        end
    end

    describe 'find_by_credentials' do 
    end

    describe 'password=' do 
    end

    describe 'valid_password?' do 
    end

    describe 'reset_session_token' do 
    end

    describe 'ensure_session_token' do 
    end

    describe 'generate_session_token' do 
    end

    describe 'find_by_credentials' do 
    end
end






def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    return nil unless user && user.valid_password?(password)
    user
end

def password=(password)
    @password = password;
    self.password_digest = BCrypt::Password.create(password)
end

def valid_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
end

def reset_session_token!
    self.session_token = self.generate_session_token
    self.save!
    self.session_token
end

def ensure_session_token
    self.session_token ||= self.generate_session_token
end

def generate_session_token
    SecureRandom.urlsafe_base64(16)
end
