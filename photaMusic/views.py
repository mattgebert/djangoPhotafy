from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

# Create your views here.
def defaultView(request):
    return render(
        request=request,
        template_name="photaMusic/defaultview.html",
        context={
            # Add variables here
        }
    )

from .models import audioContainer

def music_view(request, song_id):
    question = get_object_or_404(audioContainer, pk=song_id)
    return render(request, 'polls/results.html', {'question': question})

def music_form(request, song_id):
    question = get_object_or_404(audioContainer, pk=song_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
