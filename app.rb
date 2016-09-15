require 'sinatra'

get '/signin' do
  send_file 'signin.html'
end

get '/rushee' do
  send_file 'rushee.html'
end

get '/rushees' do
  send_file 'rushees.html'
end
