﻿import m from 'mithril'
import MarkdownIt from 'markdown-it'
import error from '../shared/error'
import service from '../../utils/service.js'
import {
    responseErrors,
    humanProjectSpent
} from '../../utils/helpers'
import tasks_list from '../tasks/tasks_list'
import files from '../attached_files/files'

export default function Project() {
    let project = {},
        errors = [],
        id,
        md,

        get = () =>
            service.getProject(id)
                .then((result) => project = result)
                .catch((error) => errors = responseErrors(error))

    return {
        oninit(vnode) {
            id = m.route.param('id')
            get()
            md = new MarkdownIt()
        },

        view(vnode) {
            return m(".project", (project) ? [
                m('h1.title', [
                    m('span.mr-2', project.name),
                    (project.category && project.category.id > 0) ?
                        m('a.badge.badge-light.mr-2', { onclick: () => m.route.set('/categories/' + project.category.id) }, [
                            m('i.fa.fa-tag.mr-1'),
                            project.category.name
                        ]) : null,
                    m('button.btn.btn-sm.btn-default[type=button]', {
                        onclick: () => m.route.set('/projects/edit/' + project.id)
                    }, 'Edit'),
                ]),
                m('p.project-time-spent', [
                    m('i.fa.fa-clock-o.mr-2'),
                    'Total time spent: ' + humanProjectSpent(project),
                ]),
                (project.description) ? m('p.project-contents', m.trust(md.render(project.description))) : null,
                m(files, { files: project.files, readOnly: true }),
                m(tasks_list, { tasks: project.tasks, onUpdate: get }),
                m(error, { errors: errors }),
                m('button#floating-add-button.btn.btn-primary[type=button]', {
                    onclick: () => m.route.set('/tasks/new?project_id=' + project.id)
                },
                    m('i.fa.fa-plus'),
                ),
                m('.actions.mt-4', [
                    m('button.btn.btn-outline-secondary.mr-2[type=button]', {
                        onclick: () => window.history.back()
                    }, "Back"),
                ])
            ] : m('Loading...'))
        }
    }
}
