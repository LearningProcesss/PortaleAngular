var { ObjectID } = require("mongodb")
const { Ticket } = require("../models/ticket")
const { PortalUser } = require("../models/portaluser")
const _ = require("lodash")
const parserz = require('../lib/parserz')
const PagedResult = require("../viewmodel/pagedresult")
var d = require('debug')("app:ticketsController")

exports.getTicket = async (req, resp) => {

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).json({
            messaggio: "Non trovato."
        })
    }

    try {

        const ret = await Ticket.findOne({ _id: req.params.id })

        if (ret) {

            const portalUser = await PortalUser.findById(req.utenteloggato)

            ret.visualizzatoIl = Date.now()
            ret.visualizzatoDa = portalUser.fullName

            await ret.update();
        }

        resp.json(ret)
    } catch (error) {
        resp.status(500).json({
            messaggio: error
        })
    }
}

exports.getTickets = async (req, resp) => {

    const pageSize = (_.isNull(req.query.pagesize) || _.isUndefined(req.query.pagesize)) ? 10 : +req.query.pagesize

    const currentPage = (_.isNull(req.query.page) || _.isUndefined(req.query.page)) ? 1 : +req.query.page

    const querytecnico = (_.isNull(req.query._tecnico) || _.isUndefined(req.query._tecnico)) ? "" : req.query._tecnico

    d("tecnico:", querytecnico)

    var ret = Ticket.find({ _tecnico: querytecnico })
        .populate("_cliente", "nome cognome")
        .populate("_tecnico", "nome cognome")

    if (pageSize && currentPage) {
        ret.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    var pageResult = new PagedResult(currentPage, pageSize);

    pageResult.setcollection = await ret;

    pageResult.count = await Ticket.countDocuments();

    d("pagedresult", pageResult.collection)

    resp.json(pageResult)
}

exports.saveTicket = async (req, resp) => {

    // var objData = parserz.Parze(Ticket.schema.obj, req.body);

    var nuovoTicket = new Ticket(req.body)

    if (!_.isNull(req.body.evento) && !_.isUndefined(req.body.evento)) {
        nuovoTicket.eventi.push(req.body.evento)
    }

    try {
        
        const ret = await nuovoTicket.save()

        resp.status(201).json({ id: ret._id })
    } catch (error) {
        resp.status(500).json({
            messaggio: error
        })
    }
}

exports.deleteTicketById = async (req, resp) => {

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).json({
            messaggio: "Non trovato."
        })
    }

    try {
        const ret = await Ticket.findByIdAndRemove({ _id: req.params.id })
        resp.status(200).json({ id: ret._id })
    } catch (error) {
        resp.status(500).json({
            messaggio: error
        })
    }
}

exports.updateTicket = async (req, resp) => {

    // Ticket.schema.eachPath((path, pathtype) => {
    //     console.log(path, pathtype);

    // })

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).json({
            messaggio: "Non trovato."
        })
    }
    try {
        req.body["modificatoIl"] = Date.now()

        var update = parserz.Mongoz(req.body);

        const ret = await Ticket.findOneAndUpdate({ _id: req.params.id }, update)

        resp.status(200).json({ id: ret._id })
    } catch (error) {
        resp.status(500).json({
            messaggio: error
        })
    }
}

// exports.getAllPosts = async (req, resp) => {

//     const pageSize = +req.query.pagesize;
//     const currentPage = +req.query.page;
//     const postQuery = Post.find({});

//     if (pageSize && currentPage) {
//         postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//     }

//     try {
//         var pageResult = new PagedResult(currentPage, pageSize);

//         pageResult.resultsArray = await postQuery;

//         pageResult.count = await Post.count();

//         resp.status(200).json({ pagedResult: pageResult });
//     } catch (error) {
//         resp.status(500).json({ messaggioErrore: "Errore lettura Posts!" });
//     }
// };

// exports.getPostById = async (req, resp) => {

//     if (!ObjectID.isValid(req.params.id)) {
//         return resp.status(404).json({ messaggioErrore: "Id non valido." });
//     }

//     try {
//         const post = await Post.findOne({ _id: req.params.id });

//         resp.status(200).send(post);
//     } catch (error) {
//         resp.status(500).json({ messaggioErrore: "Errore interno." });
//     }
// };

// exports.createPost = async (req, resp) => {

//     console.log("file", req.file);
//     console.log("body", req.body);

//     const url = req.protocol + '://' + req.get('host');

//     var obj = _.pick(req.body, ["title", "content"]);

//     obj['imagePath'] = url + '/images/' + req.file.filename;
//     obj['creator'] = req.utenteloggato.id;

//     const post = new Post(obj);

//     try {
//         var result = await post.save();

//         resp.status(200).send({ id: result._id, title: result.title, content: result.content, imagePath: result.imagePath });
//     } catch (error) {
//         resp.status(500).json({ messaggioErrore: "Errore salvataggio Post!" });
//     }
// };

// exports.updatePostById = async (req, resp) => {

//     console.log("file", req.file);
//     console.log("body", req.body);

//     let imageP = req.body.imagePath;
//     let url = "";

//     if (typeof req.file !== "undefined" && req.file !== null) {
//         url = req.protocol + '://' + req.get('host');
//         imageP = url + "/images/" + req.file.filename;
//     }

//     if (!ObjectID.isValid(req.params.id)) {
//         return resp.status(404).json({ messaggioErrore: "Id non valido." });
//     }

//     var obj = _.pick(req.body, ["title", "content"]);
//     obj['imagePath'] = url + '/images/' + req.file.filename;
//     obj['creator'] = req.utenteloggato.id;

//     try {

//         const postAggiornato = await Post.findOneAndUpdate({ _id: req.params.id, creator: req.utenteloggato.id }, obj);

//         if (typeof postAggiornato != 'undefined' && postAggiornato) {
//             resp.status(200).json(postAggiornato);
//         }
//         else {
//             resp.status(401).json({ messaggioErrore: "Post non trovato." });
//         }
//     } catch (error) {
//         resp.status(500).json({ messaggioErrore: "Errore interno." });
//     }
// };

// exports.deletePostById = async (req, resp) => {

//     if (!ObjectID.isValid(req.params.id)) {
//         return resp.status(404).json({ messaggioErrore: "Id non valido." })
//     }

//     try {
//         const postEliminato = await Post.deleteOne({ _id: req.params.id, creator: req.utenteloggato.id });

//         if (typeof postEliminato != 'undefined' && postEliminato) {
//             resp.status(200).json(postEliminato);
//         }
//         else {
//             resp.status(401).json({ messaggioErrore: "Post non trovato." })
//         }
//     } catch (error) {
//         resp.status(500).json({ messaggioErrore: "Errore interno." });
//     }
// };