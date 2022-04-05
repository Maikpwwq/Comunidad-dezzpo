const Koa = require('koa')
const Router = require('@koa/router')
const koaBody = require('koa-body')

const users = new Koa()
const userRouter = new Router()

userRouter.get('/', (ctx) => {
    console.log('Get all users', ctx)
})
//   .get('/:id', ctx => {
//     const { id } = ctx.params;
//     console.log(`Get user with id ${id}`);
//   })
//   .post('/', ctx => {
//     console.log('Create a new user');
//   })
//   .put('/:id', ctx => {
//     const { id } = ctx.params;
//     console.log(`Update user with id ${id},\nor create one if it doesn't exist`);
//   })
//   .delete('/:id', ctx => {
//     const { id } = ctx.params;
//     console.log(`Delete user with id ${id}`);
//   });

users.use(userRouter.routes())
users.use(userRouter.allowedMethods())

module.exports = users
