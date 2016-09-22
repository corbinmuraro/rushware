Rails.application.routes.draw do
  resources :signins, only: [:index, :new, :create]
  resources :applicants
  resources :people
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
