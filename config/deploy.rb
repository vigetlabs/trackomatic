require 'dotenv'
require 'capistrano/s3'

Dotenv.load

set :bucket, ENV['S3_BUCKET']
set :access_key_id, ENV['S3_ACCESS_KEY_ID']
set :secret_access_key, ENV['S3_SECRET_ACCESS_KEY']
set :bucket_write_options, { cache_control: 'max-age=3600, public' }

before 'deploy' do
  system 'NODE_ENV=production ./bin/build'
end
