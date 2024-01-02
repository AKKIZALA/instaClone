var express = require('express');
const passport = require('passport');
var router = express.Router();
const localStatgy = require('passport-local')
const userModal = require('./users')
const postModal = require('./post')
const upload = require("./multer")
passport.use(new localStatgy(userModal.authenticate()))

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.post('/register',(req, res)=>{
  const newUser =  new userModal({
    username:req.body.username,
    email:req.body.email,
    name:req.body.name
  })

  userModal.register(newUser, req.body.password).then(()=>{
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/profile')
    })
  })
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}),function(req, res) {}
);

router.get('/login',(req, res)=>{
  console.log(req.flash('error'));
  res.render('login',{"fl":req.flash('err')})
})

router.get('/logout',(req, res, next)=>{
  req.logOut((err)=>{
    if(err){ 
      return next(err)
    }
    res.redirect('/login')
  })
})

function IsLoggedIn(req, res, next){
if(req.isAuthenticated()){
  return next()
}
res.redirect('/login')
}

router.get('/feed',IsLoggedIn, async function(req, res) {
  const posts = await postModal.find().populate('user')
  res.render('feed', {footer: true, posts});
});

router.get('/profile',IsLoggedIn, async function(req, res) {
  const user = await userModal.findOne({username:req.session.passport.user})
  res.render('profile', {footer: true, user});
});

router.get('/search',IsLoggedIn, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit',IsLoggedIn, async function(req, res) {
  const user = await userModal.findOne({username:req.session.passport.user})
  res.render('edit', {footer: true,user});
});

router.post('/update', upload.single('file') , async function(req, res) {
  const user = await userModal.findOneAndUpdate(
    {username:req.session.passport.user},
    {username:req.body.username, name:req.body.name, bio:req.body.bio},
    {new:true}
    )
    if(req.file){
      user.profileImage = req.file.filename
    }
    await user.save()
    res.redirect('/profile')
});

router.get('/upload',(req, res)=>{
  res.render('upload',{footer:false})
})

router.post('/upload',IsLoggedIn,upload.single('image'),async (req, res)=>{
  const user = await userModal.findOne({username:req.session.passport.user})
  const post = await postModal.create({
    picture:req.file.filename,
    user:user._id,
    caption:req.body.caption
  })
  user.post.push(post._id)
  await user.save()
  res.redirect('/feed')
})
module.exports = router;
