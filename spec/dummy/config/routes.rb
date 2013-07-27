Rails.application.routes.draw do

  resources :images


  mount Pointsable::Engine => "/pointsable"
end
