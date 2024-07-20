import { alink, bodyAdd, br, button, create_elm, div, h1, hr, input, select_options, span } from "../vanille/components.js"
import { get_list } from "./vanille/components.js"

export function marine_container(...content) {
    return div('fr-container').add(...content)
}

export function marine_container_grid(...content) {
    return marine_container(...content).set_style({
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'
    })
}

export function set_as_ncol(n, comp, rep = undefined, gap = '10px') {
    if (window.innerWidth < 600) n = 1
    if (!rep || rep.length != n) {
        rep = Array(n).fill(0).map(() => 1)
    }
    return comp.set_style({
        display: 'grid', gridTemplateColumns: rep.map((n) => n + 'fr').join(' '), gap: gap
    })
}

export function marine_title(name, image) {
    return div().add(
        br(),
        !image ? null : div('logof').set_style({
            backgroundImage: 'url("' + image + '")',
            width: '48px', height: '48px',
            display: 'inline-block',
            marginBottom: '-10px',
            marginRight: '10px'
        }),
        h1(name).set_style({ display: 'inline-block' }),
        hr(),
    )
}

// const copy_text = 'marine.hugocastaneda.fr © Aspirant (R) Hugo Castaneda'
const copy_text = 'fr-icon.hugocastaneda.fr © Hugo Castaneda - 2024'

export function setup_marine_html(page_name = 'FR - Icons', favicon = '/favicon.svg') {

    const setup_classes = ['title', 'favicon', 'copyright']
    for (const classname of setup_classes) {
        const existing_head =
            Array.from(document.head.getElementsByClassName(classname))[0] ??
            Array.from(document.body.getElementsByClassName(classname))[0]
        if (existing_head) existing_head.remove()
    }

    const inner_html = `
        <title class="title">${page_name}</title>
        <link class="favicon" rel="icon" type="image/png" href="${favicon}" />
    `
    document.head.innerHTML += inner_html

    const body_html = `
        <div class='copyright'>
            ${copy_text}
        </div>
    `
    const body_node = create_elm('div')
    body_node.innerHTML = body_html
    document.body.append(body_node)

}

export function marine_btn(name, func) {
    return button(name, func).add_classe('fr-btn').set_style({ margin: '10px' })
}

export function marine_icon_btn(icon, func, type = 'primary', outline = false) {
    const classes = `fr-btn fr-icon-${icon}`
    const btn = button(' Label bouton', func).add_classe(classes).set_style({ margin: '10px' })
    let set_type = type
    btn.set_type = (type) => {
        btn.classList.remove(`fr-btn--${set_type}${!outline ? "-no" : ""}-outline`)
        btn.add_classe(`fr-btn--${type}${!outline ? "-no" : ""}-outline`)
        set_type = type
        return btn
    }
    return btn.set_type(type)
}

export function marine_btn_bicon(name, icon, func, type = 'primary', outline = false) {
    const classes = `fr-btn fr-icon-${icon} fr-btn--icon-left fr-btn--${type}${!outline ? "-no" : ""}-outline`
    return button(name, func).add_classe(classes).set_style({ margin: '10px' })
}

export function marine_btn_aicon(name, icon, func, type = 'primary', outline = false) {
    const classes = `fr-btn fr-icon-${icon} fr-btn--icon-right fr-btn--${type}${!outline ? "-no" : ""}-outline`
    return button(name, func).add_classe(classes).set_style({ margin: '10px' })
}

export function marine_alink_bicon(name, icon, href, target) {
    const classes = `fr-btn fr-icon-${icon} fr-btn--icon-left`
    return alink(href, target, span(name)).add_classe(classes).set_style({ margin: '10px' })
}

export function marine_input(name, pre_input, type, cb) {
    const foor = name.replace(/\s/g, '-')
    return span().add(
        create_elm('label', 'fr-label', name).set_attributes({ for: foor }),
        input(pre_input, type, cb).set_attributes({ name: foor }).add_classe('fr-input')
    )
}

export function marine_select(name, list, pre_selected, cb = () => { }) {
    const foor = name.replace(/\s/g, '-')
    return div('fr-select-group').add(
        create_elm('label', 'fr-label', name).set_attributes({ for: foor }),
        select_options(list, pre_selected, cb).set_attributes({ name: foor }).add_classe('fr-select')
    )
}

export function marine_icon(icon) {
    return span('').add_classe(`fr-icon-${icon}`).set_attributes({ 'aria-hidden': 'true' }).set_style({ margin: '4px' })
}

export function marine_radio(name, list, def, cb) {
    const foor = name.replace(/\s/g, '-')
    list = get_list(list)
    if (def) cb(def)
    return create_elm('fieldset').add_classe('fr-fieldset').set_attributes({ id: foor })
        .set_attributes({ 'aria-labelledby': "radio-inline-legend radio-inline-messages" })
        .add(
            create_elm('legend', 'fr-fieldset__legend--regular fr-fieldset__legend', name),
            ...Object.entries(list).map(([name, value], i) =>
                div('fr-fieldset__element fr-fieldset__element--inline').add(
                    div('fr-radio-group').add(
                        input('', 'radio', () => { }).set_attributes(Object.fromEntries(Object.entries({
                            name: foor, id: foor + '-' + i, checked: def == value ? true : undefined
                        }).filter(e => e[1]))).set_click(() => cb(value)),
                        create_elm('label', 'fr-label', name).set_attributes({ for: foor + '-' + i })
                    )
                )
            )
        )
}