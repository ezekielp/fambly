FactoryBot.define do 
    factory :user do
        email { 'slothrop@gr.com' }
        password { 'Schwarzgerat' }
    end

    factory :person do
        user
        first_name { 'Pirate' }
        last_name { 'Prentice' }

        trait :with_gender do
            gender { 'female' }
        end

        trait :with_age do
            age { 27 }
        end

        trait :with_months_old do
            months_old { 17 }
        end

        trait :with_full_birthdate do
            birth_year { 1937 }
            birth_month { 5 }
            birth_day { 8 }
        end
    end

    factory :person_note, class: 'Note' do
        content { 'In Africa, Asia, Amerindia, Oceania, Europe came and established its order of Analysis and Death. What it could not use, it killed or altered. In time the death-colonies grew strong enough to break away. But the impulse to empire, the mission to propagate death, the structure of it, kept on. Now we are in the last phase.' }
        association :notable, factory: :person
    end
end