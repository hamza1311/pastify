import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cors from 'cors';

const app = express();
app.use(bodyParser.json())
app.use(cors())

admin.initializeApp({
    // credential: admin.credential.cert(require('/home/hamza/Documents/secrets/pastify-app-firebase-adminsdk-zdh08-2e37b0d316.json'))
    credential: admin.credential.applicationDefault()
})

const firestore = admin.firestore()
const pastes = firestore.collection('pastes')


app.get('/:id', async (request, response) => {
    const doc = await pastes.doc(request.params.id).get()
    const data = doc.data()
    if (data === undefined) {
        response.sendStatus(404)
        return
    }
    response.send({
        id: doc.id,
        content: data.content,
        createdAt: data.createdAt.seconds,
    });
})

app.post('/', async (request, response) => {
    const content = request.body.content
    if (content === undefined) {
        response.sendStatus(400)
        return
    }
    const doc = await pastes.add({
        content: content,
        createdAt: admin.firestore.Timestamp.fromMillis(Date.now())
    })
    response.status(201).send({ id: doc.id })
})


// noinspection JSUnusedGlobalSymbols
export const api = functions.https.onRequest(app)
