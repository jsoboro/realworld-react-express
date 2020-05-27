# 요구사항

* realworld.io 에서 원하는 언어로 구현된 application 사용 (Frontends, Backends만 사용)
* application 수정 사항
   - Article의 변경사항을 확인할 수 있는 history API를 추가 (Backend 만)
* Containerized application으로 만들기 (Frontends, Backends 만 사용)
   - dev/prod 환경에 맞춰 실행 할 수 있는 docker-compose를 만들기
* application과 database의 Docker 네트워크 대역 구분
* README에 containerized 방법과 docker-compose 실행 방법 추가

# 솔루션

* Stack 선택 
   - Frontend: [React/Redux](https://github.com/gothinkster/react-redux-realworld-example-app)
   - Backend: [Node/Express](https://github.com/gothinkster/node-express-realworld-example-app)

* Article History API 추가
   - Backend API 추가를 위해 아래 작업을 진행했습니다. 
   - mongoose model 추가: 
     - ./node-express/models/History.js 
     - find().sort() 를 위해 mongoose-auto-increment 추가 사용
   - history data insert 추가: 
     - ./node-express/routes/api/article.js 내에, article 생성(router.post('/', ..) 및 수정(router.put('/:article', ..) 부분에 아래 코드 추가
   ```
      req.article.save().then(function(article){
        var history = new History();
        history.article = article;
        history.save().then(function(){
          return res.json({article: article.toJSONFor(user)});
        });
      }).catch(next);
   ```
   - 마지막으로 /:article/histories 에 대한 GET 메소드 추가
   ```
   router.get('/:article/histories', auth.optional, function(req, res, next){
     History.find({ 'article.slug': req.article.slug}).sort({'_id': 1}).then(function(histories){
       return res.json({
         histories: histories.map(function(history){
           return history.toJSONFor();
         })
       });
     }).catch(next);
   });
   ```

* **Containerized 방법**
   - Dockerfile 작성을 통한 Docker build 방식을 기본으로 하였으며, 아래 빌드 스크립트를 참조하시기 바랍니다. 
     - ./node-express/Dockerfile 
     - ./react-redux/Dockerfile 
   - 상기 Dockerfile을 아래처럼 docker-compose 스크립트 내에 build path 지정하였습니다. 
   
```
services:
   backend:
      build: ./node-express/
   frontend:
      build: ./react-redux/      
```

* Docker 네트워크 대역 구분
   - application 과 database 의 네트워크 대역 구분을 위해 아래와 같이 docker-compose.yml > networks 부분에 별도 명시하였습니다. 
   - docker-compose.dev.yml 와 docker-compose.prod.yml networks 부분에는 각기 subnet 항목 지정하였습니다. 

```
### docker-compose.yml ###
networks:
   application:
   database:
```

* **docker-compose 실행 방법**
   - dev 환경
   ```
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```
   - prod 환경
   ```
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```
