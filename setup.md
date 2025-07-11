1. ruby install 
```sh
# 1. install ruby in mac
brew install ruby
# OR
brew install rbenv ruby-build
rbenv install 3.3.8(version)
rbenv local 3.3.8 # local 설정
# 2. jekyll install
gem install jekyll bundler # 번들러 설치
gem install webrick # 웹브라우저 설치

jekyll new ./ # 현재 디렉토리에 새로운 프로젝트 생성

bundle install # 번들러 설치

bundle exec jekyll serve # 서버 실행 확인


> bundle show minima  # minima 버전 확인, 위치 확인




