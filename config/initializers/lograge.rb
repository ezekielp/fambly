require 'lograge/sql/extension'

Rails.application.configure do
    # Lograge config
    config.lograge.enabled = true
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.colorize_logging = false

    config.lograge.logger = ActiveSupport::Logger.new(File.join(Rails.root, 'log', "#{Rails.env}.log"))

    config.lograge.custom_options = lambda do |event|
      # Retrieves trace information for current thread
      correlation = Datadog.tracer.active_correlation
  
      {
        # Adds IDs as tags to log output
        :dd => {
          # To preserve precision during JSON serialization, use strings for large numbers
          :trace_id => correlation.trace_id.to_s,
          :span_id => correlation.span_id.to_s,
          :env => correlation.env.to_s,
          :service => correlation.service.to_s,
          :version => correlation.version.to_s
        },
        :ddsource => ["ruby"],
        # :params => event.payload[:params].reject { |k| %w(controller action).include? k },
        :params => event.payload[:params],
        :level => event.payload[:level],
        :time => Time.now
      }
    end
end