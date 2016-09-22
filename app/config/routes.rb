Rails.application.routes.draw do
  resources :applicants
  get 'signin', to: 'signin#index'
  get 'signin/go'

  resources :people
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
