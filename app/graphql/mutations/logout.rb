module Mutations
    class Logout < BaseMutation
        type Boolean

        def resolve
            if logged_in?
                logout
                return true
            end
            false
        end
    end
end