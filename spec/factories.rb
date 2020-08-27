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

    factory :note do
        person
        content { 'In Africa, Asia, Amerindia, Oceania, Europe came and established its order of Analysis and Death. What it could not use, it killed or altered. In time the death-colonies grew strong enough to break away. But the impulse to empire, the mission to propagate death, the structure of it, kept on. Now we are in the last phase.' }
    end

end