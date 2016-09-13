$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "pointsable/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "pointsable"
  s.version     = '0.1.0'
  s.authors     = ["Chris Gat"]
  s.email       = ["chris.gat@gmail.com"]
  s.homepage    = "http://www.thelittlepicture.ca"
  s.summary     = "This is a summary."
  s.description = "test"

  s.files = Dir["{app,config,db,lib,vendor}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["spec/**/*"]

  s.add_dependency "rails", "~> 4.1"
  s.add_dependency "jquery-rails"
end
