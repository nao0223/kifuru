module HttpRequest
  def get url
    res = req.get url
    encode res.body
  end

  def post url, param
    res = req.post url, param
    encode res.body
  end

  def twitter_client
    Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TW_CON_KEY']
      config.consumer_secret     = ENV['TW_CON_SECRET']
      config.access_token        = current_user.auth_token
      config.access_token_secret = current_user.auth_token_secret
    end
  end

  private
  def encode str, encode_str='Shift_JIS'
    str = str.force_encoding("UTF-8")
    str = str.encode("UTF-8", encode_str, :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8")
    str
  end
  def req
     Faraday.new do |faraday|
      faraday.request  :url_encoded             # form-encode POST params
      faraday.response :logger                  # log requests to STDOUT
      faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end
  end
end
