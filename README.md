# Kifuru(仮)
俺と地球を救うアプリ

# セットアップ

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)をインストール
- [Vagrant](https://www.vagrantup.com/downloads.html)をインストール
- [Kifuru](https://github.com/honkimi/kifuru/archive/master.zip)をダウンロード

```
cd {kifuruへのパス}
cd setup
vagrant up

# しばらく待ちます。

vagrant ssh
# user: vagrant, pass:vagrant

git clone https://github.com/kifuru/kifuru.git
cd kifuru
bundle install
bundle exec rake db:migrate

# しばらく待ちます。

bundle exec rails server

# http://127.0.0.1:3000/
```

# 開発について

## 開発開始時
複数人で開発するので、ソースを最新に保ちます。  
開発前に必ず

```
# ローカルPC
cd {kifuruへのパス}
vagrant ssh

# バーチャルPC
cd kifuru
git pull
bundle install
bundle exec rake db:migrate
```

をして更新がないか確認します。

```
bundle exec rails server
```

でサーバーを立ち上げます。 `http://127.0.0.1:3000/`　でアクセスできます。

## 開発箇所
#### デザイン

- `app/views/pages/`
- `public/`

の2つが大きく関わると思います。基本的にDropbox へ上げて頂いているソースからあまり修正を加えないように気をつけています。

### 国際化
`app/views/pages/` の `~.html.erb` には全て文言が書かれていません。

文言は全て `config/locales/ja.yml` に格納されています。これは国際化のために必要です。

`~.html.erb` 内にはこれに対応するように `<%= t('') %>` を呼び出してください。

## 開発完了後
ソースを反映します。

```
git add .
git commit -a -m "修正内容"
git push origin master
```

最後の`git push ~` でgithubにソースを反映します。  
`git push` 後、しばらくすると [Kifuru](https://kifuru.herokuapp.com/) が反映されると思います。

もし反映されていなければ連絡ください。

