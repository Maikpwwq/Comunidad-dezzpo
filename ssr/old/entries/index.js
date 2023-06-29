const Koa = require('koa')
const Router = require('@koa/router')
const koaBody = require('koa-body')

const entries = new Koa()
const entryRouter = new Router()

entryRouter
    .get('/', (ctx) => {
        console.log('Get all entries')
        ctx.status = 200
        ctx.body = { message: 'Get all entries' }
    })
    .get('/:id', (ctx) => {
        const { id } = ctx.params
        console.log(`Get entry with id ${id}`)
        ctx.status = 200
        ctx.body = { message: 'Get entry with id', id: id }
    })
    .post('/', koaBody(), (ctx) => {
        const { user, date, entry } = ctx.request.body
        console.log('Create a new entry')
        console.log({
            user: user,
            date: date,
            entry: entry,
        })
        ctx.status = 200
        ctx.body = {
            message: 'Create a new entry',
            entry: {
                user: user,
                date: date,
                entry: entry,
            },
        }
    })
// .put('/:id', ctx => {
//   const { id } = ctx.params;
//   console.log(`Update entry with id ${id},\nor create one if it doesn't exist`)
//   ctx.status = 200
//   ctx.body = {
//     message: `Update entry with given id, or create one if it doesn't exist',
//     id: id
//   }
// })
// .delete('/:id', ctx => {
//   const { id } = ctx.params;
//   console.log(`Delete entry with ${id}`)
//   ctx.status = 200
//   ctx.body = {
//     message: 'Delete entry with given id',
//     id: id
//   };
// });

entries.use(entryRouter.routes())
entries.use(entryRouter.allowedMethods())

module.exports = entries
