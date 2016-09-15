require 'sinatra'

get '/' do
  '<h2>These are proof of concepts. They are not functioning yet.</h1>
  <p><a href="/signin">Sign In Page</a>: what rushees will see</p>
  <p><a href="/rushee">Rushee Page</a>: example rushee profile page</p>
  <p><a href="/rushees">Rushees Page</a>: all of the rushees</p>
  <p>The plan is to make sign in capture photo + name so that after each rush event,
  we can quickly go through people we met and fill out our thoughts.</p>'
end

get '/signin' do
  send_file 'signin.html'
end

get '/rushee' do
  send_file 'rushee.html'
end

get '/rushees' do
  send_file 'rushees.html'
end
