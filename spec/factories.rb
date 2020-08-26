FactoryBot.define do 
    factory :user do
        email { 'slothrop@gr.com' }
        password { 'Schwarzgerat' }
    end

    factory :person do
        user
        first_name { 'Pirate' }
        last_name { 'Prentice' }
    end

end