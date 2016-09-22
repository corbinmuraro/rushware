class AddApplicantToSignins < ActiveRecord::Migration[5.0]
  def change
    add_reference :signins, :applicant, foreign_key: true
  end
end
