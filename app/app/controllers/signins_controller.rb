class SigninsController < ApplicationController
  # GET /signins
  # GET /signins.json
  def index
    @signins = Signin.all
  end

  # GET /signins/new
  def new
    @signin = Signin.new
  end

  # POST /signins
  # POST /signins.json
  def create
    applicant_params[:email].downcase!

    # Searches for Applicant using email provided. If Applicant with that email
    # does not already exist it creates it, in both cases it sets @applicant.
    @applicant = Applicant.find_or_create_by!(
    email: applicant_params[:email]) do |applicant|
      applicant.first_name = applicant_params[:first_name]
      applicant.last_name = applicant_params[:last_name]
    end

    @signin = Signin.new(signin_params)
    @signin.applicant_id = @applicant.id

    respond_to do |format|
      if @signin.save
        format.html { redirect_to new_signin_url, notice: 'Signin was successfully created.' }
        format.json { render :show, status: :created, location: @signin }
      else
        format.html { render :new }
        format.json { render json: @signin.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def applicant_params
      params.require(:applicant).permit(:first_name, :last_name, :email)
    end

    def signin_params
      params.require(:signin).permit(:picture)
    end
end
