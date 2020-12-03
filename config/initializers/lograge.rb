require 'lograge/sql/extension'

Rails.application.configure do
    # Lograge config
    config.lograge.enabled = true
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.colorize_logging = false

    config.lograge.logger = ActiveSupport::Logger.new(File.join(Rails.root, 'log', "#{Rails.env}.log"))
end