import django.dispatch


pre_create_edit_suggestion = django.dispatch.Signal(
    providing_args=[
        "instance",
        "edit_suggestion_instance",
        "edit_suggestion_date",
        "edit_suggestion_user",
        "edit_suggestion_change_reason",
        "using",
    ]
)
post_create_edit_suggestion = django.dispatch.Signal(
    providing_args=[
        "instance",
        "edit_suggestion_instance",
        "edit_suggestion_date",
        "edit_suggestion_user",
        "edit_suggestion_change_reason",
        "using",
    ]
)
